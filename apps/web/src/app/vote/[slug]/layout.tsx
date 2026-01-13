export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="vote-page-container" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto', 
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
}
