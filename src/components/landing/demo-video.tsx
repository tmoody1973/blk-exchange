export function DemoVideo() {
  return (
    <section className="bg-[#0e0e0e] border-t-2 border-white py-20 px-4" id="demo">
      <div className="mx-auto max-w-7xl">
        <h2
          className="text-2xl md:text-4xl font-bold text-white mb-8"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          SEE IT IN ACTION
        </h2>

        <div className="border-2 border-white bg-[#1a1a1a] shadow-[4px_4px_0px_0px_#ffffff] aspect-video w-full flex items-center justify-center">
          {/* Replace src with actual YouTube embed URL when available */}
          <div className="flex flex-col items-center gap-4 text-[#a0a0a0]">
            <div className="w-16 h-16 border-2 border-[#7F77DD] flex items-center justify-center">
              <span className="text-3xl text-[#7F77DD]">▶</span>
            </div>
            <p
              className="text-sm"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              DEMO VIDEO COMING SOON
            </p>
          </div>
        </div>

        {/* Uncomment and replace URL to embed YouTube video:
        <div className="border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] aspect-video w-full overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="BLK Exchange Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        */}
      </div>
    </section>
  );
}
