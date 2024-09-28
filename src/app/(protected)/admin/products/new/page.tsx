"use client";

import { useState } from "react";
import DetailForm from "@/app/(protected)/suppliers/products/components/DetailForm";
import EssentialForm from "@/app/(protected)/suppliers/products/components/EssentialForm";
import InventoryForm from "@/app/(protected)/suppliers/products/components/InventoryForm";

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