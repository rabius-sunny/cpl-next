type Direction = 'horizontal' | 'vertical'

export const useImageSliderVariants = (total: number, direction: Direction = 'horizontal') => {
  const getPreset = (index: number) => {
    const baseTransition = {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96]
    }

    const scaleBase = 1
    const scaleReduction = 0.05
    const offset = direction === 'horizontal' ? 60 : 80

    // Calculate directional values based on direction
    const getDirectionalValues = () => {
      if (direction === 'horizontal') {
        return {
          initial: {
            x: 300 + index * offset,
            y: index * 8,
            rotateY: -15
          },
          animate: {
            x: index * offset,
            y: index * 8,
            rotateY: 0
          },
          exit: {
            x: 300 + (total + index + 1) * offset,
            y: index * 8,
            rotateY: 15
          }
        }
      }

      // Vertical animation with 90-degree rotation
      return {
        initial: {
          x: 0,
          y: 300 + index * offset,
          rotateZ: -90
        },
        animate: {
          x: 0,
          y: index * offset,
          rotateZ: 0
        },
        exit: {
          x: 0,
          y: 300 + (total + index + 1) * offset,
          rotateZ: 90
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
