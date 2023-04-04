import React from "react";
import { useNavigate } from "react-router-dom";
import Base from "../layout/Base";

function Feed() {
  return (
    <>
      <Base>
        <div className="sm:flex justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto block">
            <div className="bg-white rounded px-6 py-8 border border-slate-200">
              <h1 className="text-2xl font-bold mb-4">Feed</h1>
              <p className="text-gray-700">This is the feed page.</p>
            </div>
          </div>
          <div className="sm:w-3/5 h-full sm:sticky mt-16 top-16">
            <div className="bg-white rounded px-6 py-8 border border-slate-200 overflow-y-auto">
              <h1 className="text-2xl font-bold mb-4">Feed</h1>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Cupiditate quis, suscipit atque maiores, veniam nihil libero non
                quidem esse debitis maxime neque rerum omnis ut voluptatibus
                ipsam. Similique, odit pariatur? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Minima veniam pariatur libero
                fugiat? Eveniet voluptatem et, iusto recusandae quibusdam
                accusamus fugiat ipsum, voluptatum inventore repellat minima id
                magnam illum quas! Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Cupiditate quis, suscipit atque maiores,
                veniam nihil libero non quidem esse debitis maxime neque rerum
                omnis ut voluptatibus ipsam. Similique, odit pariatur? Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Minima veniam
                pariatur libero fugiat? Eveniet voluptatem et, iusto recusandae
                quibusdam accusamus fugiat ipsum, voluptatum inventore repellat
                minima id magnam illum quas! Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Cupiditate quis, suscipit atque
                maiores, veniam nihil libero non quidem esse debitis maxime
                neque rerum omnis ut voluptatibus ipsam. Similique, odit
                pariatur? Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Minima veniam pariatur libero fugiat? Eveniet voluptatem
                et, iusto recusandae quibusdam accusamus fugiat ipsum,
                voluptatum inventore repellat minima id magnam illum quas! Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
                quis, suscipit atque maiores, veniam nihil libero non quidem
                esse debitis maxime neque rerum omnis ut voluptatibus ipsam.
                Similique, odit pariatur? Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Minima veniam pariatur libero fugiat? Eveniet
                voluptatem et, iusto recusandae quibusdam accusamus fugiat
                ipsum, voluptatum inventore repellat minima id magnam illum
                quas! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Cupiditate quis, suscipit atque maiores, veniam nihil libero non
                quidem esse debitis maxime neque rerum omnis ut voluptatibus
                ipsam. Similique, odit pariatur? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Minima veniam pariatur libero
                fugiat? Eveniet voluptatem et, iusto recusandae quibusdam
                accusamus fugiat ipsum, voluptatum inventore repellat minima id
                magnam illum quas! Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Cupiditate quis, suscipit atque maiores,
                veniam nihil libero non quidem esse debitis maxime neque rerum
                omnis ut voluptatibus ipsam. Similique, odit pariatur? Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Minima veniam
                pariatur libero fugiat? Eveniet voluptatem et, iusto recusandae
                quibusdam accusamus fugiat ipsum, voluptatum inventore repellat
                minima id magnam illum quas! Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Cupiditate quis, suscipit atque
                maiores, veniam nihil libero non quidem esse debitis maxime
                neque rerum omnis ut voluptatibus ipsam. Similique, odit
                pariatur? Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Minima veniam pariatur libero fugiat? Eveniet voluptatem
                et, iusto recusandae quibusdam accusamus fugiat ipsum,
                voluptatum inventore repellat minima id magnam illum quas! Lorem
                ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
                quis, suscipit atque maiores, veniam nihil libero non quidem
                esse debitis maxime neque rerum omnis ut voluptatibus ipsam.
                Similique, odit pariatur? Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Minima veniam pariatur libero fugiat? Eveniet
                voluptatem et, iusto recusandae quibusdam accusamus fugiat
                ipsum, voluptatum inventore repellat minima id magnam illum
                quas!
              </p>
            </div>
          </div>
          <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto block">
            <div className="bg-white rounded px-6 py-8 border border-slate-200">
              <h1 className="text-2xl font-bold mb-4">Feed</h1>
              <p className="text-gray-700">This is the feed page.</p>
            </div>
          </div>
        </div>
      </Base>
    </>
  );
}

export default Feed;
