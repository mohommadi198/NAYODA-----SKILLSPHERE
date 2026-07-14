import {
  IndianRupee,
  Clock3,
  Link2,
  Lightbulb,
  Send,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../services/jobsServices";
import { postProposal } from "../services/proposalServices";
import MessageButton from "../components/MessageButton";

export default function SubmitProposal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    coverLetter: "",
    bidAmount: "",
    deliveryTime: "1 Month",
    attachments: [""],
  });

  const [project , setProject] = useState({});
  const id = useParams().projectId;

  useEffect(() => {
    const fetchProject = async () => {
      getJobById(id).catch((err) => {
        console.error(err);
      }).then((data) => {
        setProject(data?.data);
      });
    };

    fetchProject();
  },[id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addAttachment = () => {
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ""],
    }));
  };

  const removeAttachment = (index) => {
    const updated = form.attachments.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      attachments: updated.length ? updated : [""],
    }));
  };

  const handleAttachmentChange = (index, value) => {
    const updated = [...form.attachments];
    updated[index] = value;
    setForm((prev) => ({
      ...prev,
      attachments: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.coverLetter || !form.bidAmount || !form.deliveryTime) return;

    setLoading(true);
    try {
      const payload = {
        jobId: project._id || id,
        coverLetter: form.coverLetter,
        bidAmount: Number(form.bidAmount),
        deliveryTime: form.deliveryTime,
        attachments: form.attachments.filter(Boolean),
      };
    
      await postProposal(payload).then((res) => {
        if (res?.status === 201) {
          navigate(`/browse/jobs/${id}`);
        }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Project Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={16} />
          Back to project
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 px-8 py-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Submit Proposal</h1>
                <p className="mt-1 text-slate-500">{project?.title}</p>
              </div>
              {project?.client?._id && (
                <MessageButton
                  recipientId={project.client._id}
                  projectId={project._id}
                  label="Message Client"
                />
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                name="coverLetter"
                required
                rows={6}
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Explain why you're the perfect fit..."
                className="w-full rounded-xl border border-slate-200 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <IndianRupee size={16} /> Bid Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    name="bidAmount"
                    required
                    value={form.bidAmount}
                    onChange={handleChange}
                    placeholder="5000"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock3 size={16} /> Delivery Time <span className="text-red-500">*</span>
                </label>
                <select
                  name="deliveryTime"
                  required
                  value={form.deliveryTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 py-3 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 bg-white"
                >
                  <option>1 Day</option>
                  <option>3 Days</option>
                  <option>1 Week</option>
                  <option>2 Weeks</option>
                  <option>1 Month</option>
                  <option>2 Months</option>
                  <option>3 Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Link2 size={16} /> Portfolio / Links
              </label>
              <div className="space-y-3">
                {form.attachments.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://github.com/your-project"
                      value={link}
                      onChange={(e) => handleAttachmentChange(index, e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="p-3 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAttachment}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} /> Add another link
                </button>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl bg-blue-50 p-4 border border-blue-100">
              <Lightbulb className="text-blue-600 flex-shrink-0" size={20} />
              <p className="text-sm text-blue-800">
                Pro Tip: Personalized proposals mentioning specific project requirements get 3x more responses.
              </p>
            </div>
          </form>

          <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-slate-50 px-8 py-6">
            <button
              onClick={() => navigate(-1)}
              disabled={loading}
              className="px-6 py-2.5 font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {loading ? "Sending..." : "Send Proposal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}