"use client";
import { useState } from "react";
export default function SalesDashboard(){
    const[Costomers,setCostomer]=useState([
        {id:1,name:"optima-sync" , email:"optima-sync@gmail.com" ,status:"lead-initial"},
        {id:2,name:"Microsoft" ,email:"Microsoft@gmail.com" ,stsus:"I"},
        {id:3,name:"Vercel" ,email:"Vercel@gmail.com" ,status:"N"},
        {id:4,name:"meta" ,email:"meta@gmail.com" ,status:"close"},
        {id:5,name:"google" ,email:"google@gmail.com" ,status:"win"}

    ])
    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Customer name :</th>
                        <th>Customer Email :</th>
                        <th>Customer status :</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{Costomers.name}</th>
                        <th>{Costomers.email}</th>
                        <th>{Costomers.status}</th>
                    </tr>

                </tbody>
            </table>
        </div>
    )
}