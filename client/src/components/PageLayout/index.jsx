import logo from '../../assets/spotify.png';

import home from '../../assets/home.png';
import like from '../../assets/like.png';
import profile from '../../assets/profile.png';

import './PageLayout.css';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { post } from '../../utils/request';

const defaultMenus = [
  { label: 'Home', icon: home, url: '/home' },
  { label: 'My Like', icon: like, url: '/like' },
  { label: 'My Profile', icon: profile, url: '/profile' },
];

function PageLayout(props) {
  const navigate = useNavigate();
  const { menus = defaultMenus } = props;

  const { userInfo } = useSelector((store) => store);

  const handleLogout = () => {
    post('/api/user/logout').then((resp) => {
      navigate('/');
    });
  };

  return (
    <div className="page-root">
      <aside className="asider">
        <img src={logo} width={44} height={44} alt="logo" />
        <div className="asider-menu">
          {menus.map((menu) => {
            const { label, icon, url } = menu;
            const isActive = props.url === url;

            return (
              <div
                key={label}
                className={`asider-menu-item ${
                  isActive ? 'asider-menu-item-active' : ''
                }`}
                onClick={() => navigate(url)}
              >
                <img
                  src={icon}
                  width={22}
                  height={22}
                  alt="ico"
                  className="asider-menu-item-icon"
                />
                <span className="asider-menu-label">{label}</span>
              </div>
            );
          })}
        </div>
      </aside>
      <div className="content">
        <header className="content-nav">
          <span className="content-nav-username">{userInfo.username}</span>
          <button className="white" onClick={handleLogout}>
            Log out
          </button>
        </header>

        <div className="content-main">
          <div className="success-msg" style={{ fontSize: 16 }}>
            {props.successMsg}
          </div>
          <div className="error-msg" style={{ fontSize: 16 }}>
            {props.errMsg}
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
