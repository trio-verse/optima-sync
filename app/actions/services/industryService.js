export async function creatIndustry (name){
    
    const response =await fetch("",{
        method:"POST",
        headers:{
            "Content-Type":"applecation/json",

        },
        body:JSON.stringify(name)
    })
    const resdata=await response.json();
    if(!response.ok){
        return{
            succsses:false,
            message:resdata.data.message
        }
    }
    const newOrgId = resdata?.data?.id;
        if (newOrgId) {

            cookieStore.set("organaisationId", String(newOrgId), {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax"
            });
            return{
                succsses:true
            }

}}