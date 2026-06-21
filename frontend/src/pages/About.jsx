export default function About() {
  return (
    <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="backdrop-blur-xl bg-dark-surface/50 border border-dark-border rounded-2xl p-8 md:p-12 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">
          About Seetra
        </h1>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>
            Seetra is an academic demonstration system designed to visualize image processing and pattern recognition techniques. 
            It is tailored for research and educational purposes, allowing users to upload images, apply various processing operations interactively, 
            and observe both the visual results and the underlying mathematical processes transparently.
          </p>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tech Stack</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><span className="font-medium text-primary">Frontend:</span> React.js + Vite, Tailwind CSS</li>
              <li><span className="font-medium text-primary">Backend:</span> Python Flask, OpenCV, NumPy, Pillow</li>
              <li><span className="font-medium text-primary">Architecture:</span> Stateless API with in-memory session caching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
