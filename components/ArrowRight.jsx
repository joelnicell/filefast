const ArrowRight = ({ size, color, disabled }) => {
  const cl = "lucide lucide-arrow-right-icon lucide-arrow-right" + (disabled ? " section-disabled" : "");
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size ? size : "24"} height={size ? size : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cl}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  )
}

export default ArrowRight;