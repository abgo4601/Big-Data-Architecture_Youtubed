import React, { useState, useEffect } from "react";
import Script from "react-load-script";
import "./Trends.css";

export default function GoogleTrends({ type, keyword, url }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    let widget;
    const renderGoogleTrend = () => {
      if (scriptLoaded) {
        widget = window.trends.embed.renderExploreWidgetTo(
          document.getElementById("widget"),
          type,
          {
            comparisonItem: [{ keyword, geo: "US", time: "today 12-m" }],
            category: 0,
            property: "",
          },
          {
            exploreQuery: `q=${encodeURI(keyword)}&geo=US&date=today 12-m`,
            guestPath: "https://trends.google.com:443/trends/embed/",
          }
        );
      }
    };

    renderGoogleTrend();

    return () => {
      // Clean up the widget when the component unmounts
      if (widget && widget.parentNode) {
        widget.parentNode.removeChild(widget);
      }
    };
  }, [scriptLoaded, type, keyword]);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  return (
    <div className='widgetStyle'>
      <Script url={url} onLoad={handleScriptLoad} />
      <div id='widget' className='widgetStyle'></div>
    </div>
  );
}
