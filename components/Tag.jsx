const Tag = ({ children, onClick, active, disabled, large }) => {
  return (
    <button
      className={`${large ? 'tag-large' : 'tag'} ${active ? 'tag-active' : disabled ? 'btn-disabled' : ''}`}
      onClick={disabled ? null : onClick}
      >
      {children}
    </button>
  )
}

export default Tag;