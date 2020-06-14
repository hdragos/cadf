import * as React from "react"

function LogoComponent(props) {
  return (
    <svg width="3em" height="1.5em" viewBox="-0.5 -0.5 202 83" {...props}>
      <g stroke="#000">
        <path
          fill="#fff"
          strokeWidth={2}
          pointerEvents="all"
          d="M1 1h80v80H1zM121 1h80v80h-80z"
        />
        <path
          d="M101 51l20 30M81 81l20-30M101 31l20-30M101 31L81 1"
          fill="none"
          strokeWidth={2}
          strokeMiterlimit={10}
          pointerEvents="stroke"
        />
        <circle
          cx={41}
          cy={41}
          fill="#fff"
          strokeWidth={3}
          pointerEvents="all"
          r={25}
        />
        <circle
          cx={161}
          cy={41}
          fill="#fff"
          strokeWidth={3}
          pointerEvents="all"
          r={25}
        />
        <path
          d="M61 61H21M51 31v40M31 16v40M36 21H16M71 31H31M51 51H31M16 66l50-50"
          fill="none"
          strokeWidth={2}
          strokeMiterlimit={10}
          strokeDasharray="6 6"
          pointerEvents="stroke"
        />
      </g>
    </svg>
  )
}

export default LogoComponent
