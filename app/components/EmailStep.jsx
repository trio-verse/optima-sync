export default function EmailStep({email,setEmail,error,success,loading,handleEmailSubmit}){
    return(
        <form onSubmit={handleEmailSubmit} className="flex flex-col w-full gap-4" noValidate>
                        <div className="flex flex-col gap-1">
                            <label className="text-zinc-700 font-semibold">Email:</label>
                            <input 
                                className="bg-white border border-zinc-200 w-full text-zinc-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 transition-all shadow-sm" 
                                type="email" 
                                name="email" 
                                placeholder="username@gmail.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="flex items-start gap-2 mt-1">
                            <input type="checkbox" className="cursor-pointer mt-0.5" />
                            <label className="text-[11px] text-zinc-500">By continuing, you agree to our ERP Terms of Service and Corporate Privacy Policy.</label>
                        </div>
                        {error && <p className="text-rose-500 text-xs font-semibold">{error}</p>}
                        {success && <p className="text-emerald-500 text-xs font-semibold">{success}</p>}
                        <button className="bg-blue-500 hover:bg-blue-700 font-bold py-3 rounded-xl text-sm transition-all duration-300 text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                            {loading ? "Requesting OTP..." : "Get Verification Code"}
                        </button>
                    </form>
    )
}