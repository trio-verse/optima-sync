"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import createNewOrganisation from "../actions/createNewOrganisation";


export default function OrgForm() {
    const router = useRouter();


    const [orgData, setOrgData] = useState({
        Name: "",
        Email: "",
        orgCountryCode: "",
        Phone: "",
        Address: "",
        description: ""

    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrgData(prev => ({ ...prev, [name]: value }))
    }
    
    const getPhonePlaceholder = () => {
    switch (orgData.orgCountryCode) {
        case "+971": return "50 123 4567";     
        case "+966": return "50 123 4567";     
        case "+961": return "70 123 456";      
        case "+962": return "7 9123 4567";    
        case "+963": 
        default:     return "933 457 812";     
    }
};
    const validateForm = async () => {

        if (!orgData.Name.trim() || !orgData.Email.trim() || !orgData.Phone.trim() || !orgData.Address.trim() || !orgData.description.trim()) {
            setError("please fill out all required fields");
            return;
        }
        if (orgData.Name.trim().length < 3) {
            setError("Organisation name must be at least 3 characters long.")
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(orgData.Email)) {
            setError("Invalid email format or contains spaces!");
            return;
        }
        const cleanPhone = orgData.Phone.replace(/[\s+]/g, "");
        const phoneRegex = /^[0-9]+$/;
        
        
        if (!phoneRegex.test(cleanPhone)) {
            setError("phone number must contain only number");
            return false;
        }
        if (cleanPhone.length < 9 || cleanPhone.length > 12) {
            setError("please enter a vaild phone number");
            return false
        }
        return true;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!validateForm()) {
            return
        }
        setLoading(true);
        const fullPhoneNumber=`${orgData.orgCountryCode}${orgData.Phone.replace(/[\s+]/g, "")}`;
        const orgPayload={...orgData,Phone:fullPhoneNumber}
        const result = await createNewOrganisation(orgPayload);
        if (result.success) {
            setSuccess("Organisation created successfully! ");

        } else {
            setError(result.message);
            setLoading(false);
        }
    }
    return (
        <div aria-description="Org-Container" className="min-h-lvh flex justify-center items-center bg-gradient-to-tr from-slate-50 via-blue-50/30 to-zinc-100 p-6">


            <div aria-description="Org-Card" className="w-full max-w-2xl bg-white/60 flex flex-col items-center justify-center rounded-2xl p-8 shadow-sm  border border-white/40 ">


                <div aria-description="Org-header" className="text-center w-full mb-8">
                    <h1 className="text-zinc-900 font-extrabold text-3xl tracking-wide mb-2">
                        Create Organisation
                    </h1>
                    <p className="text-zinc-500 text-xs px-4 leading-relaxed font-medium">
                        Set up your organisation workspace to start managing your team, projects, and ERP operations.
                    </p>
                </div>


                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full" noValidate>


                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Organisation Name:</label>
                        <input
                            required
                            type="text"
                            name="Name"
                            value={orgData.Name}
                            onChange={handleChange}
                            placeholder="Optima Solutions"
                            className="bg-white border border-zinc-200 w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm"
                        />
                    </div>


                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Organisation Email:</label>
                        <input
                            required
                            type="email"
                            name="Email"
                            value={orgData.Email}
                            onChange={handleChange}
                            placeholder="info@optima-sync.com"
                            className="bg-white border border-zinc-200 w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm"
                        />
                    </div>


                    <div className="flex flex-col gap-1.5 ">
                    <label className="text-zinc-700 font-semibold text-xs tracking-wide">Phone Number:</label>
                    <div className= "flex items-center bg-white rounded-xl w-full border border-zinc-200  text-zinc-900  px-4 py-2.5 outline-none focus-within:border-blue-500 focus-within:ring-1 transition-all shadow-sm text-sm">
                        <select className=" text-black border-r border-zinc-200 outline-none w-24" name="orgCountryCode" value={orgData.orgCountryCode} onChange={handleChange}>
                            <option value="+963">🇸🇾 +963</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+966">🇸🇦 +966</option>
                            <option value="+961">🇱🇧 +961</option>
                            <option value="+962">🇯🇴 +962</option>
                        </select>

                        <input
                            required
                            type="tel"
                            name="Phone"
                            value={orgData.Phone}
                            onChange={handleChange}
                            placeholder={getPhonePlaceholder()}
                            className="outline-none"

                        />
                        </div>
                    </div>


                    <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Address:</label>

                        <input
                            required
                            type="text"
                            name="Address"
                            placeholder="City , Country"
                            onChange={handleChange}
                            value={orgData.Address}
                            className="bg-white border border-zinc-200 w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm"
                        />
                    </div>


                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-zinc-700 font-semibold text-xs tracking-wide">Description:</label>
                        <textarea
                            required
                            rows="3"
                            name="description"
                            value={orgData.description}
                            onChange={handleChange}
                            placeholder="Tell us more about your business fields, branches, or operations..."
                            className="bg-white border border-zinc-200 w-full  text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm text-sm resize-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        {error && <p className="text-rose-500 text-xs font-semibold mb-2">{error}</p>}
                        {success && <p className="text-emerald-500 text-xs font-semibold mb-2">{success}</p>}
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 font-bold w-full py-3 rounded-xl text-sm transition-all duration-300 text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2 mt-2"
                    >
                        {loading ? "Creating workspace..." : "Create & Get Started"}
                    </button>
                </form>
            </div>
        </div>
    );
}