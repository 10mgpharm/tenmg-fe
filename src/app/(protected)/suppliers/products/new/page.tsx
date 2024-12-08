"use client";

import { useState } from "react";
import DetailForm from "../_components/DetailForm";
import EssentialForm from "../_components/EssentialForm";
import InventoryForm from "../_components/InventoryForm";

const AddProducts = () => {

    const [steps, setSteps] = useState<'details' | 'essentials' | 'inventory'>('details');

    switch (steps) {
        case 'details':
            // TODO: fix this form error
            // return <DetailForm setSteps={setSteps}/>
        case 'essentials':
            return <EssentialForm setSteps={setSteps}/>
        case 'inventory':
            return <InventoryForm setSteps={setSteps}/>
        default:
            break;
    }
  return (
    <div className="p-8"></div>
  )
}

export default AddProducts