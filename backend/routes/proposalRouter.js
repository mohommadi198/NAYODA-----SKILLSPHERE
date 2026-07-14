const express = require('express');
const router = express.Router();

const {
  postProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  getMyProposals,
  getJobProposals,
  acceptProposal,
  rejectProposal,
  searchProposals,
} = require('../controllers/proposalController');

const authMiddleware = require('../middleware/auth');

// @route   POST /api/proposals/post
// @desc    Submit a proposal for a gig (protected, freelancer only)
router.post('/post', authMiddleware, postProposal);

router.get('/all', authMiddleware, getAllProposals);

// @route   GET /api/proposals/search
// @desc    Search proposals (protected)
router.get('/search', authMiddleware, searchProposals);

// @route   GET /api/proposals/myProposals
// @desc    Get proposals submitted by current freelancer (protected)
router.get('/myProposals', authMiddleware, getMyProposals);

// @route   GET /api/proposals/job/: jobId
// @desc    Get all proposals for a job (protected, client who owns the job)
router.get('/job/:jobId', authMiddleware, getJobProposals);

// @route   GET /api/proposals/:id
// @desc    Get a specific proposal by ID (protected)
router.get('/:id', authMiddleware, getProposalById);

// @route   PUT /api/proposals/:id
// @desc    Update a proposal (protected, freelancer who submitted the proposal)
router.put('/:id', authMiddleware, updateProposal);


// @route   DELETE /api/proposals/:id
// @desc    Delete a proposal (protected, freelancer who submitted the proposal)
router.delete('/:id', authMiddleware, deleteProposal);

// @route   PUT /api/proposals/:id/accept
// @desc    Accept a proposal (protected, client who owns the job)
router.put('/:id/accept', authMiddleware, acceptProposal);

// @route   PUT /api/proposals/:id/reject
// @desc    Reject a proposal (protected, client who owns the job)
router.put('/:id/reject', authMiddleware, rejectProposal);


module.exports = router;