import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(() => {
    // Restore from localStorage on reload
    const saved = localStorage.getItem('listingData');
    return saved ? JSON.parse(saved) : {
      imageUrls: [],
      name: '',
      description: '',
      address: '',
      type: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
    };
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync to localStorage for persistence on refresh
  useEffect(() => {
    localStorage.setItem('listingData', JSON.stringify(formData));
  }, [formData]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setUploading(false);
          setFiles([]); // Clear state
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear file input visually
          }
        })
        .catch((err) => {
          console.error('Upload error:', err);
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload up to 6 images per listing');
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'mern-estate');

      fetch('https://api.cloudinary.com/v1_1/dkbd8qtc4/image/upload', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) resolve(data.secure_url);
          else reject('No secure_url returned');
        })
        .catch((err) => reject(err));
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (['parking', 'furnished', 'offer'].includes(id)) {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (['number', 'text', 'textarea'].includes(type)) {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1)
      return setError('Please upload at least one image');
    if (formData.offer && +formData.discountPrice >= +formData.regularPrice)
      return setError('Discount price must be lower than regular price');

    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.message || 'Listing creation failed');
      localStorage.removeItem('listingData'); // Clear cache on success
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          {/* Text Inputs */}
          <input type='text' id='name' placeholder='Name' className='border p-3 rounded-lg'
            maxLength='62' minLength='10' required onChange={handleChange} value={formData.name} />
          <textarea id='description' placeholder='Description' className='border p-3 rounded-lg'
            required onChange={handleChange} value={formData.description} />
          <input type='text' id='address' placeholder='Address' className='border p-3 rounded-lg'
            required onChange={handleChange} value={formData.address} />

          {/* Options */}
          <div className='flex flex-wrap gap-4'>
            {['sale', 'rent'].map((type) => (
              <label key={type} className='flex items-center gap-2'>
                <input type='checkbox' id={type} checked={formData.type === type}
                  onChange={handleChange} className='w-5 h-5' />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
            {['parking', 'furnished', 'offer'].map((option) => (
              <label key={option} className='flex items-center gap-2'>
                <input type='checkbox' id={option} checked={formData[option]}
                  onChange={handleChange} className='w-5 h-5' />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>

          {/* Numeric Inputs */}
          <div className='flex flex-wrap gap-4'>
            <Input label='Beds' id='bedrooms' value={formData.bedrooms} handleChange={handleChange} />
            <Input label='Baths' id='bathrooms' value={formData.bathrooms} handleChange={handleChange} />
            <Input label='Regular Price' id='regularPrice' value={formData.regularPrice} handleChange={handleChange} />
            {formData.offer && (
              <Input label='Discount Price' id='discountPrice' value={formData.discountPrice} handleChange={handleChange} />
            )}
          </div>
        </div>

        {/* Right - Image Upload & Preview */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images: <span className='text-gray-600 text-sm'>(You can only Upload 6 Images)</span>
          </p>
          <div className='flex gap-2'>
            <input
              type='file'
              ref={fileInputRef}
              className='border p-3 rounded w-full'
              onChange={(e) => setFiles(e.target.files)}
              multiple
              accept='image/*'
            />
            <button type='button' disabled={uploading} onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg uppercase'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && <p className='text-red-700'>{imageUploadError}</p>}

          {formData.imageUrls.map((url, i) => (
            <div key={url} className='flex justify-between items-center p-2 border'>
              <img src={url} alt='upload' className='h-20 w-20 object-cover rounded' />
              <button type='button' onClick={() => handleRemoveImage(i)}
                className='text-red-600 hover:underline uppercase'>Delete</button>
            </div>
          ))}

          <button
            type='submit'
            disabled={loading || uploading}
            className='bg-slate-700 text-white p-3 rounded hover:opacity-90 disabled:opacity-70 uppercase'
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className='text-red-600 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}

function Input({ id, value, handleChange, label }) {
  return (
    <div className='flex items-center gap-2'>
      <input
        type='number'
        id={id}
        value={value}
        min='0'
        className='p-3 border rounded w-28'
        onChange={handleChange}
        required
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
