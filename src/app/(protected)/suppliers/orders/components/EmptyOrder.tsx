import Image from 'next/image'
import pills from '../../../../../assets/Images/pills.svg';

const EmptyOrder = () => {
  return (
    <div className='mt-24'>
        <Image src={pills} alt='' className='mx-auto'/>
        <div className="max-w-xs mx-auto mt-4 text-center">
            <h3 className='text-xl font-semibold text-gray-700'>No Order Yet</h3>
            <p className='mt-3'>You currently have no orders. All orders will appear here.</p>
        </div>
    </div>
  )
}

export default EmptyOrder