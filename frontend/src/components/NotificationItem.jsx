export default function NotificationItem(){
    return(
        <>
            <div className='p-2 border-b border-gray-200'>
                <div className="flex items-center gap-2">
                    <div className='rounded-full bg-amber-300 size-10'></div>
                    <p className='text-gray-700'>Deyvid Marmolejo stard to follow you</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-4">
                    <p className="">Jun 10, 2025 </p>
                    <p className="">Seen</p>
                </div>
            </div>
        </>
    )
}