import { useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice.ts';
import { Button } from '../common/Button';

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <aside style={{ width: '250px', backgroundColor: '#343a40', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2>Finanças App</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/transactions" style={{ color: '#fff', textDecoration: 'none' }}>Transações</Link>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <Button variant="danger" onClick={handleLogout} style={{ width: '100%' }}>Sair</Button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f8f9fa', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}