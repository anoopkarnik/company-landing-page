export const getConnectionsAction = async (userId:string) => {
    const connectionsResponse = await fetch("/api/connections/getConnections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    const { connections } = await connectionsResponse.json();
    return connections;
}

export const deleteConnectionAction = async (id:string) => {
    const reponse = await fetch("/api/connections/deleteConnection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    if(reponse.status !== 200){
        return {error: "Failed in deleting Connection"};
    }
    return {success: "Successfully deleted Connection"};
}

export const createConnectionAction = async ({name, type, userId, details }: {name:string,type:string,userId:string,details:any}) => {
    const response = await fetch("/api/connections/addConnection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, userId, details }),
      });
    if(response.status !== 200){
        return {error: "Failed in creating Connection"};
    }
    return {success: "Successfully created Connection"};
}