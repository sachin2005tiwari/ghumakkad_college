import { useState } from "react";

interface Props {
    imageUrl: string;
    name: string;
    description: string; 
}

function AttractionCard(props: Props) {
    const {imageUrl, name, description} = props;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div
            // Container mein relative position aur hover effects maintain kiye hain
            className="w-64 h-72 rounded-lg shadow-xl overflow-hidden m-2 relative 
                       transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
        >
            
            {/* Image: Isko dimming effect diya hai (opacity 10) */}
            <img
                src={imageUrl}
                alt={name}
                // Image ko halka dim (dull) kar do
                className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-10' : 'opacity-100'}`}
            />

            {/* ⬇️ CODE CHANGE: Name Bar Animation - Ab yeh Top tak jaayega ⬇️ */}
            <div 
                // Name bar hamesha bottom par rahega. Height 72 (288px) fix hai. 
                // Top tak jaane ke liye use poori height (288px) jitna upar khiskana hoga.
                className={`absolute inset-x-0 bottom-0 p-4 bg-white bg-opacity-80 
                            transition-transform duration-500 z-10 
                            // ⬇️ MAIN FIX: Card ki poori height (h-72) utna upar le jao
                            ${isHovered ? 'translate-y-[-288px]' : 'translate-y-0'}`} 
            >
                <h3 className="text-xl font-bold text-gray-800 text-center">
                    {name}
                </h3>
            </div>
            {/* ⬆️ CODE CHANGE: Name Bar Animation ⬆️ */}
            
            {/* ⬇️ Description Overlay (Jo Name Bar ke upar aane par dikhega) ⬇️ */}
            <div
                className={`absolute inset-0 p-4 pt-12 flex flex-col justify-start items-center text-center 
                            bg-black bg-opacity-10	0 transition-opacity duration-500 text-white
                            opacity-0 
                            ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
            >
                {/* Name ko yahan repeat kar rahe hain taki woh top pe show ho */}
                <h3 className="text-2xl font-bold mb-3 mt-4">
                    {name}
                </h3>
                
                {/* Description Text */}
                <p className="text-sm font-light leading-relaxed">
                    {description}
                </p>
                
            </div>
        </div>
    );
}	

export default AttractionCard;