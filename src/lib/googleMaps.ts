// Prevent multiple script loads with singleton pattern
let googleMapsLoadingPromise: Promise<any> | null = null

// Google Maps Loader with consistent API
export function getGoogleMapsLoader() {
  return {
    load: async () => {
      // If already loaded, return immediately
      if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
        return (window as any).google.maps
      }

      // If already loading, return the same promise
      if (googleMapsLoadingPromise) {
        return googleMapsLoadingPromise
      }

      // Load script if not already present
      if (typeof window === 'undefined') {
        throw new Error('Google Maps can only be loaded in browser')
      }

      // Create the loading promise
      googleMapsLoadingPromise = new Promise<any>((resolve, reject) => {
        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
        if (existingScript) {
          // Wait a bit for it to load
          const checkInterval = setInterval(() => {
            if ((window as any).google && (window as any).google.maps) {
              clearInterval(checkInterval)
              resolve((window as any).google.maps)
            }
          }, 100)
          setTimeout(() => {
            clearInterval(checkInterval)
            if ((window as any).google && (window as any).google.maps) {
              resolve((window as any).google.maps)
            } else {
              reject(new Error('Google Maps failed to load'))
            }
          }, 5000)
          return
        }

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry,routes&loading=async`
        script.async = true

        script.onload = () => {
          setTimeout(() => {
            const maps = (window as any).google?.maps
            if (maps) {
              resolve(maps)
            } else {
              reject(new Error('Google Maps API failed to load'))
            }
          }, 100)
        }

        script.onerror = () => {
          googleMapsLoadingPromise = null
          reject(new Error('Failed to load Google Maps script'))
        }

        document.head.appendChild(script)
      })

      return googleMapsLoadingPromise
    },
  }
}
