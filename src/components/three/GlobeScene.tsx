'use client'
import { useEffect, useRef } from 'react'

interface Destination {
  lat: number
  lng: number
  name: string
}

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  }
}

export function GlobeScene({ destinations = [] }: { destinations?: Destination[] }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    let animId: number

    import('three').then(THREE => {
      const container = mountRef.current!
      const width = container.clientWidth
      const height = container.clientHeight

      // Scene
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
      camera.position.z = 2.5

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      container.appendChild(renderer.domElement)

      // Globe
      const globeGeometry = new THREE.SphereGeometry(1, 64, 64)
      const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x0D1628,
        emissive: 0x071020,
        shininess: 80,
      })
      const globe = new THREE.Mesh(globeGeometry, globeMaterial)
      scene.add(globe)

      // Wireframe overlay
      const wireGeometry = new THREE.SphereGeometry(1.002, 24, 24)
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x00E5CC,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      })
      scene.add(new THREE.Mesh(wireGeometry, wireMaterial))

      // Atmosphere glow
      const atmGeometry = new THREE.SphereGeometry(1.08, 64, 64)
      const atmMaterial = new THREE.MeshPhongMaterial({
        color: 0x00E5CC,
        transparent: true,
        opacity: 0.04,
        side: THREE.FrontSide,
      })
      scene.add(new THREE.Mesh(atmGeometry, atmMaterial))

      // Lights
      const ambientLight = new THREE.AmbientLight(0x333355, 1.5)
      scene.add(ambientLight)

      const coralLight = new THREE.PointLight(0xFF6B6B, 2, 10)
      coralLight.position.set(3, 2, 3)
      scene.add(coralLight)

      const tealLight = new THREE.PointLight(0x00E5CC, 1.5, 10)
      tealLight.position.set(-3, -1, 2)
      scene.add(tealLight)

      // Destination pins
      destinations.forEach(dest => {
        const pos = latLngToVector3(dest.lat, dest.lng, 1.02)
        const pinGeometry = new THREE.SphereGeometry(0.018, 8, 8)
        const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6B6B })
        const pin = new THREE.Mesh(pinGeometry, pinMaterial)
        pin.position.set(pos.x, pos.y, pos.z)
        globe.add(pin)

        // Glow ring
        const ringGeometry = new THREE.RingGeometry(0.025, 0.04, 16)
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xFF6B6B,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.position.set(pos.x, pos.y, pos.z)
        ring.lookAt(0, 0, 0)
        globe.add(ring)
      })

      // Star field background
      const starGeometry = new THREE.BufferGeometry()
      const starCount = 1500
      const positions = new Float32Array(starCount * 3)
      for (let i = 0; i < starCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 })
      scene.add(new THREE.Points(starGeometry, starMaterial))

      // Mouse interaction
      let mouseX = 0, mouseY = 0
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        mouseX = ((e.clientX - rect.left) / width - 0.5) * 0.5
        mouseY = ((e.clientY - rect.top) / height - 0.5) * 0.5
      }
      container.addEventListener('mousemove', handleMouseMove)

      // Animation
      const animate = () => {
        animId = requestAnimationFrame(animate)
        globe.rotation.y += 0.003
        globe.rotation.x += (mouseY - globe.rotation.x) * 0.05
        renderer.render(scene, camera)
      }
      animate()

      // Cleanup
      return () => {
        cancelAnimationFrame(animId)
        container.removeEventListener('mousemove', handleMouseMove)
        renderer.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    })
  }, [destinations])

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: '350px', cursor: 'grab' }}
    />
  )
}
