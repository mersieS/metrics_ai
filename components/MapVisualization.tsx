import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { GeoLocation, MapRegion } from '../types';

interface MapVisualizationProps {
  region: MapRegion;
  data: GeoLocation[];
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ region, data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Setup projection
    let projection;
    if (region === MapRegion.TURKEY) {
      // Focused on Turkey coordinates
      projection = d3.geoMercator()
        .center([35, 39]) // Center of Turkey approx
        .scale(dimensions.width * 4) // Zoom in
        .translate([dimensions.width / 2, dimensions.height / 2]);
    } else {
      // World view
      projection = d3.geoMercator()
        .scale(dimensions.width / 6.5)
        .translate([dimensions.width / 2, dimensions.height / 1.5]);
    }

    const pathGenerator = d3.geoPath().projection(projection);

    // Draw Map Background (Sphere/Ocean)
    svg.append("rect")
       .attr("width", dimensions.width)
       .attr("height", dimensions.height)
       .attr("fill", "#0f172a"); // Slate-900

    // Fetch World Topology
    // Using a reliable CDN for world-110m.json
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((topology: any) => {
      if (!topology) return;

      const countries = topojson.feature(topology, topology.objects.countries);

      // Draw Countries
      svg.selectAll("path")
        .data((countries as any).features)
        .enter()
        .append("path")
        .attr("d", pathGenerator as any)
        .attr("fill", "#1e293b") // Slate-800
        .attr("stroke", "#334155") // Slate-700
        .attr("stroke-width", 0.5)
        .attr("class", "transition-colors duration-200 hover:fill-slate-700");

      // Add user location pulses
      const filteredData = region === MapRegion.TURKEY 
        ? data.filter(d => d.country === 'Turkey') 
        : data;

      // Draw pulse circles
      svg.selectAll(".pulse")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "pulse")
        .attr("cx", d => projection!([d.lng, d.lat])![0])
        .attr("cy", d => projection!([d.lng, d.lat])![1])
        .attr("r", 5)
        .attr("fill", "#6366f1")
        .attr("opacity", 0.5)
        .append("animate")
        .attr("attributeName", "r")
        .attr("from", 5)
        .attr("to", 20)
        .attr("dur", "1.5s")
        .attr("repeatCount", "indefinite")
        .select(function() { return this.parentNode; }) // Go back to circle
        .append("animate")
        .attr("attributeName", "opacity")
        .attr("from", 0.5)
        .attr("to", 0)
        .attr("dur", "1.5s")
        .attr("repeatCount", "indefinite");

      // Draw static points
      svg.selectAll(".point")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", d => projection!([d.lng, d.lat])![0])
        .attr("cy", d => projection!([d.lng, d.lat])![1])
        .attr("r", 4)
        .attr("fill", "#818cf8")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
            // Simple Tooltip implementation using title
            d3.select(this).attr("r", 6).attr("fill", "#fff");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 4).attr("fill", "#818cf8");
        })
        .append("title")
        .text(d => `${d.city}: ${d.users} Users`);

    }).catch(err => {
      console.error("Could not load map data", err);
      // Fallback text
      svg.append("text")
         .attr("x", dimensions.width / 2)
         .attr("y", dimensions.height / 2)
         .attr("text-anchor", "middle")
         .attr("fill", "white")
         .text("Harita verisi yüklenemedi.");
    });

  }, [dimensions, region, data]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800 relative">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="block w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400">
          {region === MapRegion.WORLD ? 'Dünya Görünümü' : 'Türkiye Görünümü'}
        </p>
        <p className="text-sm font-bold text-white">
          Aktif Kullanıcı: {data.reduce((acc, curr) => acc + curr.users, 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
};