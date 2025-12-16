const profiles = [
    {img: '', name: 'Deyvid Marmolejo'},
    {img: '', name: 'Deyvid Marmolejo'},
    {img: '', name: 'Deyvid Marmolejo'},
    {img: '', name: 'Deyvid Marmolejo'},
    {img: '', name: 'Deyvid Marmolejo'},
]

export default function ({...props}){
    return(
        <ul {...props}>
            {profiles.map((profile, index)=>(
                <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-amber-400 size-8"></div>
                        <p className="text-gray-700 font-semibold">{profile.name}</p>
                    </div>
                    <button className="rounded-full text-sm bg-emerald-500 px-3 py-0.5 font-semibold text-white shadow-xs hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Follow</button>
                </li>
            ))}

            
        </ul>
    )
}