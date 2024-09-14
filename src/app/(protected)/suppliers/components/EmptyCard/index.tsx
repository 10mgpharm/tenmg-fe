import Image from 'next/image';
import file from '@/assets/Images/folders.svg'

const EmptyCard = () => {
  return (
    <div className="text-center">
        <Image src={file} alt='' className='mx-auto mt-16 mb-5'/>
        <h3 className='text-lg font-semibold text-gray-600 mb-2'>No data available</h3>
        <p className='text-gray-500 mb-10'>There’s no information to show yet.</p>
    </div>
  )
}

export default EmptyCard;