type Mode = "xyz" | "address" | "planet";

type Props = {
    value: Mode;
    onChange: (value: Mode)=>void;
};

export type InputMode =
    "xyz" |
    "address" |
    "planet";


export default function InputTabs({
    value,
    onChange
}:Props){

    const tabs = [
        {
            id:"xyz",
            label:"XYZ"
        },
        {
            id:"address",
            label:"Adresse"
        },
        {
            id:"planet",
            label:"Planet"
        }
    ] as const;


    return (

        <div
            style={{
                display:"flex",
                gap:"5px",
                marginBottom:"10px"
            }}
        >

            {
                tabs.map(tab=>(

                    <button

                        key={tab.id}

                        onClick={()=>onChange(tab.id)}

                        style={{

                            padding:"5px 12px",

                            cursor:"pointer",

                            background:
                                value === tab.id
                                ? "#1b6ca8"
                                : "#102544",

                            color:"white",

                            border:"1px solid #ffffff33"

                        }}

                    >

                        {tab.label}

                    </button>

                ))
            }

        </div>

    );

}