type Direction = 'horizontal' | 'vertical'

export const useImageSliderVariants = (total: number, direction: Direction = 'horizontal') => {
  const getPreset = (index: number) => {
    if (total >= 4) {
      return {
        initial: {
          opacity: 0.5,
          x: 500 + index * 200,
          y: 0,
          rotateY: index * 15,
          scale: 0.8 - (1 - index * 0.05)
        },
        animate: {
          opacity: 1,
          x: -index * 55,
          y: 0,
          rotateY: -index * 1,
          scale: 1 + index * 0.02
        },
        exit: {
          opacity: 0,
          x: 800 - index * 100,
          y: 0,
          rotateY: -90 - index * 25,
          scale: 0.85
        }
      }
    }

    if (total === 3) {
      return {
        initial: {
          opacity: 0,
          x: 0,
          y: 300 + index * 100,
          rotateY: -90,
          scale: 0.7
        },
        animate: {
          opacity: 1,
          x: 0,
          y: -index * 10,
          rotateY: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          x: 0,
          y: -300 - index * 100,
          rotateY: -90,
          scale: 0.7
        }
      }
    }

    // <= 2
    return {
      initial: {
        opacity: 0,
        x: direction === 'horizontal' ? 300 : 0,
        y: direction === 'vertical' ? 300 : 0,
        rotateY: 0,
        scale: 0.9
      },
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        rotateY: 0,
        scale: 1.15
      },
      exit: {
        opacity: 0,
        x: direction === 'horizontal' ? -300 : 0,
        y: direction === 'vertical' ? -300 : 0,
        rotateY: 0,
        scale: 0.9
      }
    }
  }

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {}
  }

  return { getPreset, containerVariants }
}
