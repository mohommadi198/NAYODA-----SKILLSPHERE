const { default: api } = require("./api")


const getAllFreelancers = async () => { 
    try{
        const response = await api.get("/users/freelancers")
        return response.data
    } catch (error) {
        console.error("Error fetching freelancers:", error)
        throw error
    }
}

const getFreelancerById = async (freelancerId) => {
    try {
        const response = await api.get(`/users/freelancers/${freelancerId}`);
        console.log("Called !");
        return response.data;
    } catch (error) {
        console.error("Error fetching freelancer by ID:", error);
        throw error;
    }
}

module.exports = {
    getAllFreelancers,
    getFreelancerById,
}
