"use client";

import { useState } from "react";
import DetailForm from "../components/DetailForm";
import EssentialForm from "../components/EssentialForm";
import InventoryForm from "../components/InventoryForm";

const AddProducts = () => {

    const [steps, setSteps] = useState<'details' | 'essentials' | 'inventory'>('details');

    switch (steps) {
        case 'details':
            return <DetailForm setSteps={setSteps}/>
        case 'essentials':
            return <EssentialForm setSteps={setSteps}/>
        case 'inventory':
            return <InventoryForm setSteps={setSteps}/>
        default:
            console.log('Fruit not recognized.');
            break;
    }
  return (
    <div className="p-8"></div>
  )
}

export default AddProducts