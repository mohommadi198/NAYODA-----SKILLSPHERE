const { default: api } = require("./api")


const getAllJobs = async () => { 
    try{
        const response = await api.get("/jobs/")
        return response.data
    } catch (error) {
        console.error("Error fetching jobs:", error)
        throw error
    }
}

const getJobById = async (jobId) => {
    try {
        const response = await api.get(`/jobs/getById/${jobId}`);
        console.log("Called !");
        return response.data;
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        throw error;
    }
}

const createJob = async (jobData) => {
    try {
        const response = await api.post("/jobs/", jobData);
        return response.data;
    } catch (error) {
        console.error("Error creating job:", error);
        throw error;
    }
}

const updateJob = async (jobId, updatedData) => {
    try {
        const response = await api.put(`/jobs/updateJob/${jobId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating job:", error);
        throw error;
    }
}

const updateJobStatus = async (jobId, statusData) => {
    try {
        const response = await api.put(`/jobs/updateStatus/${jobId}`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error updating job status:", error);
        throw error;
    }
}

const getMyJobs = async () => {
    try {
        const response = await api.get("/jobs/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching my jobs:", error);
        throw error;
    }
}

const activateMilestone = async (jobId, milestoneId) => {
    try {
        const response = await api.post(`/jobs/${jobId}/milestones/${milestoneId}/activate`);
        return response.data;
    } catch (error) {
        console.error("Error activating milestone:", error);
        throw error;
    }
}

const submitMilestone = async (jobId, milestoneId, data) => {
    try {
        const response = await api.post(`/jobs/${jobId}/milestones/${milestoneId}/submit`, data);
        return response.data;
    } catch (error) {
        console.error("Error submitting milestone:", error);
        throw error;
    }
}

const approveMilestone = async (jobId, milestoneId) => {
    try {
        const response = await api.post(`/jobs/${jobId}/milestones/${milestoneId}/approve`);
        return response.data;
    } catch (error) {
        console.error("Error approving milestone:", error);
        throw error;
    }
}

const requestChangesMilestone = async (jobId, milestoneId, data) => {
    try {
        const response = await api.post(`/jobs/${jobId}/milestones/${milestoneId}/requestChanges`, data);
        return response.data;
    } catch (error) {
        console.error("Error requesting changes on milestone:", error);
        throw error;
    }
}

const resubmitMilestone = async (jobId, milestoneId) => {
    try {
        const response = await api.post(`/jobs/${jobId}/milestones/${milestoneId}/resubmit`);
        return response.data;
    } catch (error) {
        console.error("Error resubmitting milestone:", error);
        throw error;
    }
}

const payMilestone = async (jobId, milestoneId) => {
    try {
        const response = await api.post(`/jobs/${jobId}/milestones/${milestoneId}/pay`);
        return response.data;
    } catch (error) {
        console.error("Error paying milestone:", error);
        throw error;
    }
}

const getFreelancerActiveJobs = async () => {
    try {
        const response = await api.get("/jobs/freelancer/active");
        return response.data;
    } catch (error) {
        console.error("Error fetching freelancer active jobs:", error);
        throw error;
    }
}

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    updateJobStatus,
    getMyJobs,
    getFreelancerActiveJobs,
    activateMilestone,
    submitMilestone,
    approveMilestone,
    requestChangesMilestone,
    resubmitMilestone,
    payMilestone,
}
