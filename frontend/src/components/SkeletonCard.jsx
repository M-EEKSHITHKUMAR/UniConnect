const SkeletonCard = () => (
  <div style={{
    backgroundColor: 'white', borderRadius: '16px',
    border: '1px solid #f1f5f9', padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '4px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '14px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '33%', marginBottom: '6px' }} />
        <div style={{ height: '11px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '25%' }} />
      </div>
    </div>
    <div style={{ height: '16px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '75%', marginBottom: '10px' }} />
    <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '100%', marginBottom: '6px' }} />
    <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '66%', marginBottom: '16px' }} />
    <div style={{ height: '160px', backgroundColor: '#f1f5f9', borderRadius: '12px', marginBottom: '16px' }} />
    <div style={{ display: 'flex', gap: '10px' }}>
      <div style={{ height: '36px', backgroundColor: '#f1f5f9', borderRadius: '10px', width: '80px' }} />
      <div style={{ height: '36px', backgroundColor: '#f1f5f9', borderRadius: '10px', width: '100px' }} />
    </div>
  </div>
)

export default SkeletonCard