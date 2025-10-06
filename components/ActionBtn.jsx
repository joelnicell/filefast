const ActionBtn = ({ children, onClick, active, disabled }) => {
  return (
    <button
      className={`action-btn ${active ? 'action-btn-active' : disabled ? 'btn-disabled' : ''}`}
      onClick={disabled ? null : onClick}
      >
      {children}
    </button>
  )
}

export default ActionBtn;