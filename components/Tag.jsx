const Tag = ({ children, onClick, active, disabled }) => {
  return (
    <button
      className={`tag ${active ? 'tag-active' : disabled ? 'btn-disabled' : ''}`}
      onClick={disabled ? null : onClick}
      >
      {children}
    </button>
  )
}

export default Tag;