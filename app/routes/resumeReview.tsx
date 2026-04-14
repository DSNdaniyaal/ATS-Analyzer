import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  {
    title: "ResumKnight - Resume Review",
  },
  {
    name: "description",
    content:
      "Detailed review of your resume with actionable feedback to help you land your dream job.",
  },
];

const resumeReview = () => {
  const { id } = useParams();
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume-review/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadReume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) {
        console.error("Resume not found");
        return;
      }

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) {
        console.error("Failed to load resume file");
        return;
      }
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);

      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) {
        console.error("Failed to load image file");
        return;
      }
      const imageBlobUrl = URL.createObjectURL(
        new Blob([imageBlob], { type: "image/jpeg" }),
      );
      setImageUrl(imageBlobUrl);

      setFeedback(data.feedback);

      console.log(imageUrl, resumeUrl, feedback);
    };

    loadReume();
  }, [id]);

  return (
    <main className="!pt-0 ">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-3 h-3" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('./images/bg-small.svg')] bg-cover h-[100dvh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl: h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  alt="resume preview"
                  className="h-full w-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resumeReview;
