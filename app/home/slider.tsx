'use client';

import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import pic1 from '../../public/assets/pic-1.jpeg';
import pic2 from '../../public/assets/pic-2.jpeg';
import pic3 from '../../public/assets/pic-3.jpeg';
import pic4 from '../../public/assets/Najeeb - ur - Rehman - Raja.png';
import user1 from '../../public/assets/user-1.jpg';
import user2 from '../../public/assets/user-2.png';
import user3 from '../../public/assets/user-3.jpg';
import user4 from '../../public/assets/user-4.png';
import user5 from '../../public/assets/user-5.jpg';
import user6 from '../../public/assets/user-6.png';
import user7 from '../../public/assets/user-7.webp';
import user8 from '../../public/assets/user-8.png';
import user9 from '../../public/assets/user-9.jpg';
import user10 from '../../public/assets/user-10.png';
import user11 from '../../public/assets/user-11.jpg';
import user12 from '../../public/assets/user-12.png';
import user13 from '../../public/assets/user-13.jpg';
import user14 from '../../public/assets/user-14.png';
import user15 from '../../public/assets/user-15.webp';
import user16 from '../../public/assets/user-16.png';
import user19 from '../../public/assets/user-19.jpg';
import user20 from '../../public/assets/user-20.png';

// Import NEW Mannan Style Transformation Series
import mannanBase from '../../public/assets/Mannan_Base.jpeg';
import mannaStyle1 from '../../public/assets/Manna_new_style1.png';
import mannaStyle2 from '../../public/assets/Manna_new_style2.png';
import mannaStyle3 from '../../public/assets/Manna_new_style3.png';
import mannaStyle4 from '../../public/assets/Manna_new_style4.png';
import mannaStyle5 from '../../public/assets/Manna_new_style5.png';
import mannaStyle6 from '../../public/assets/Manna_new_style6.png';
import mannaStyle7 from '../../public/assets/Manna_new_style7.png';
import mannaStyle8 from '../../public/assets/Manna_new_style8.png';
import mannaStyle9 from '../../public/assets/Manna_new_style9.png';
import mannaStyle10 from '../../public/assets/Manna_new_style10.png';
import mannaStyle11 from '../../public/assets/Manna_new_style11.png';
import mannaStyle12 from '../../public/assets/Manna_new_style12.png';
import mannaStyle13 from '../../public/assets/Manna_new_style13.png';
import mannaStyle14 from '../../public/assets/Manna_new_style14.png';

// Marquee Component - Continuous scrolling from left to right
interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
}

const Marquee = ({ children, direction = 'right', speed = 30, pauseOnHover = true }: MarqueeProps) => {
  return (
    <>
      <div
        className="overflow-hidden w-full"
      >
        <div
          className="flex w-max"
          style={{
            animation: `marquee-${direction} ${speed}s linear infinite`,
            animationPlayState: 'running',
          }}
          onMouseEnter={(e) => {
            if (pauseOnHover) {
              e.currentTarget.style.animationPlayState = 'paused';
            }
          }}
          onMouseLeave={(e) => {
            if (pauseOnHover) {
              e.currentTarget.style.animationPlayState = 'running';
            }
          }}
        >
          {/* First set of images */}
          <div className="flex flex-shrink-0">
            {children}
          </div>
          {/* Duplicate for seamless continuous loop */}
          <div className="flex flex-shrink-0">
            {children}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

interface SliderImage {
  src: string | StaticImageData;
  alt: string;
  title?: string;
  description?: string;
}

interface ImagePair {
  front: SliderImage;
  back: SliderImage;
}

interface SliderProps {
  images?: SliderImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultImages: SliderImage[] = [
  {
    src: pic4,
    alt: 'Traditional Ethnic Wear',
  },
  {
    src: pic1,
    alt: 'Traditional Ethnic Wear',
  },
  {
    src: pic2,
    alt: 'Casual Street Style',
  },
  {
    src: pic3,
    alt: 'Smart Casual Professional',
  },
  {
    src: user1,
    alt: 'User 1',
  },
  {
    src: user2,
    alt: 'User 2',
  },
  {
    src: user3,
    alt: 'User 3',
  },
  {
    src: user4,
    alt: 'User 4',
  },
  {
    src: user5,
    alt: 'User 5',
  },
  {
    src: user6,
    alt: 'User 6',
  },
  {
    src: user7,
    alt: 'User 7',
  },
  {
    src: user8,
    alt: 'User 8',
  },
  {
    src: user9,
    alt: 'User 9',
  },
  {
    src: user10,
    alt: 'User 10',
  },
  {
    src: user11,
    alt: 'User 11',
  },
  {
    src: user12,
    alt: 'User 12',
  },
  {
    src: user13,
    alt: 'User 13',
  },
  {
    src: user14,
    alt: 'User 14',
  },
  {
    src: user15,
    alt: 'User 15',
  },
  {
    src: user16,
    alt: 'User 16',
  },
  {
    src: user19,
    alt: 'User 19',
  },
  {
    src: user20,
    alt: 'User 20',
  },
];

// Create Mannan Series Pairs (Base + Styles)
const mannanStyles = [
  mannaStyle1, mannaStyle2, mannaStyle3, mannaStyle4, mannaStyle5,
  mannaStyle6, mannaStyle7, mannaStyle8, mannaStyle9, mannaStyle10,
  mannaStyle11, mannaStyle12, mannaStyle13, mannaStyle14
];

const mannanPairs: ImagePair[] = mannanStyles.map((style, index) => ({
  front: { src: mannanBase, alt: 'Base Image' },
  back: { src: style, alt: `Transformation Style ${index + 1}` }
}));

// Create pairs of images for flip effect
const createImagePairs = (images: SliderImage[]): ImagePair[] => {
  const pairs: ImagePair[] = [];
  // Add original pairing logic as fallbacks/extras
  for (let i = 0; i < images.length; i += 2) {
    pairs.push({
      front: images[i],
      back: images[i + 1] || images[0],
    });
  }
  return pairs;
};

export default function Slider({
  images = defaultImages,
  autoPlay = true,
  autoPlayInterval = 2000,
}: SliderProps) {
  // Combine Mannan series with existing images
  // Mannan series comes first as requested
  const imagePairs = [...mannanPairs, ...createImagePairs(images)];

  // Track flip state for each image individually
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    new Array(imagePairs.length).fill(false)
  );

  const handleFlip = (index: number, isFlipped: boolean) => {
    setFlippedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = isFlipped;
      return newStates;
    });
  };

  return (
    <section className="py-20 px-4 bg-background transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-yellow-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6 tracking-tight">
            Style Transformations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover versatile fashion styles powered by AI.
            <span className="text-emerald-600 dark:text-emerald-400 font-bold"> Hover to see the transformation!</span>
          </p>
        </div>
        <div className="w-full bg-muted/30 border border-border p-4 rounded-[40px] backdrop-blur-sm shadow-inner">
          <Marquee direction="right" speed={20} pauseOnHover={true}>
            {imagePairs.map((pair, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[300px] h-[550px] mx-4"
                style={{ perspective: '1000px' }}
              >
                {/* Flip Card Container */}
                <div
                  className="relative w-full h-full cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.7s',
                    transform: flippedStates[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  onMouseEnter={() => handleFlip(index, true)}
                  onMouseLeave={() => handleFlip(index, false)}
                >
                  {/* Front Side (Before) */}
                  <div
                    className="absolute inset-0 rounded-lg overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <Image
                      src={pair.front.src}
                      alt={pair.front.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      draggable={false}
                    />
                    {/* Before Tag */}
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-r-full text-xs font-bold shadow-lg">
                      Before
                    </div>
                  </div>

                  {/* Back Side (After) */}
                  <div
                    className="absolute inset-0 rounded-lg overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Image
                      src={pair.back.src}
                      alt={pair.back.alt}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                    {/* After Tag */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-l-full text-xs font-bold shadow-lg">
                      After
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
