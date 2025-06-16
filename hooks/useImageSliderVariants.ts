type Direction = 'horizontal' | 'vertical'

export const useImageSliderVariants = (total: number, direction: Direction = 'horizontal') => {
  const getPreset = (index: number) => {
    const baseTransition = {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
      delay: index * 0.3
    }

    const scaleBase = 1
    const scaleReduction = 0.05
    const offset = direction === 'horizontal' ? 30 : 30

    // Calculate directional values based on direction
    const getDirectionalValues = () => {
      if (direction === 'horizontal') {
        return {
          initial: {
            x: 300 + index * offset,
            y: index * 10,
            rotateY: -15
          },
          animate: {
            x: index * offset,
            y: index * 5,
            rotateY: 0
          },
          exit: {
            x: 300 + (total + index) * offset,
            y: index * 5,
            rotateY: 15
          }
        }
      }

      // Vertical animation with 90-degree rotation
      return {
        initial: {
          x: 300 + index * offset,
          y: 300 + index * offset,
          rotateZ: 90
        },
        animate: {
          x: index * offset,
          y: index * offset,
          rotateZ: 0
        },
        exit: {
          x: 300 + (total + index) * offset,
          y: 300 + (total + index) * offset,
          rotateZ: -90
        }
      }
    }

    const dirValues = getDirectionalValues()

    return {
      initial: {
        opacity: 0,
        scale: scaleBase - index * scaleReduction,
        zIndex: total - index,
        ...dirValues.initial,
        transition: {
          ...baseTransition,
          delay: index * 0.3
        }
      },
      animate: {
        opacity: 1,
        scale: scaleBase - index * scaleReduction,
        zIndex: total - index,
        ...dirValues.animate,
        transition: {
          ...baseTransition,
          delay: index * 0.3
        }
      },
      exit: {
        opacity: 0,
        scale: 0.9,
        ...dirValues.exit,
        transition: {
          ...baseTransition,
          delay: (total - index - 1) * 0.3
        }
      }
    }
  }

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
        staggerDirection: 1
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.3,
        staggerDirection: -1
      }
    }
  }

  return { getPreset, containerVariants }
}
