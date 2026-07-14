const { default: api } = require("./api")

const postProposal = async (proposalData) => {
    try{
        const response = await api.post("/proposals/post", proposalData);
        return response.data;
    }catch(err){
        console.error("Error posting proposal:", err);
        throw err;
    }
}

const getJobProposals = async (jobId) => {
    try {
        const response = await api.get(`/proposals/job/${jobId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching job proposals:", err);
        throw err;
    }
}

const acceptProposal = async (proposalId) => {
    try {
        const response = await api.put(`/proposals/${proposalId}/accept`);
        return response.data;
    } catch (err) {
        console.error("Error accepting proposal:", err);
        throw err;
    }
}

const rejectProposal = async (proposalId) => {
    try {
        const response = await api.put(`/proposals/${proposalId}/reject`);
        return response.data;
    } catch (err) {
        console.error("Error rejecting proposal:", err);
        throw err;
    }
}

const getMyProposals = async () => {
    try {
        const response = await api.get("/proposals/myProposals");
        return response.data;
    } catch (err) {
        console.error("Error fetching my proposals:", err);
        throw err;
    }
}

module.exports = {
    postProposal,
    getJobProposals,
    acceptProposal,
    rejectProposal,
    getMyProposals,
}