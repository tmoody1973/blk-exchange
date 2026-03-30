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

        <div className="border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] aspect-video w-full overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/OH9_fjhAbfM"
            title="BLK Exchange Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
