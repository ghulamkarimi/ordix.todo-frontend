import { checkSessionAPi, selectedIsAuthenticated, selectUser, userLogoutApi } from '@/feature/userSlice';
import { toggleSidebar, selectIsSidebarOpen } from '@/feature/appSlice';
import { AppDispatch, useAppSelector } from '@/store';
import { Menu, ChevronRight, List, Plus, LogOut, Circle } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayTasks } from '@/feature/taskSlice';

const Sidebar = () => {
  const isAuthenticated = useAppSelector(selectedIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const tasks = useSelector(displayTasks);
     

  const handleLogout = async () => {
    try {
      const response = await dispatch(userLogoutApi()).unwrap();
      localStorage.removeItem('userId');
      toast.success(response.message || 'Erfolgreich abgemeldet');
      navigate('/login');
    } catch (error: any) {
      toast.error(error || 'Abmelden fehlgeschlagen');
    }
  };

  useEffect(() => {
    dispatch(checkSessionAPi());
  }, [dispatch]);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Handle sidebar item click - close sidebar on mobile when open
  const handleItemClick = () => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden"
          onClick={handleToggleSidebar}
        />
      )}
      
      <div
        className={`min-h-screen bg-white shadow-lg flex flex-col p-1 md:p-4 transition-all duration-300 ease-in-out fixed md:static z-20 ${
          isSidebarOpen ? 'w-40 md:w-64' : 'w-10 md:w-64'
        }`}
      >
        <div>
          {/* Menü-Header */}
          <div className="flex justify-between items-center mb-6">
            {isSidebarOpen && <h2 className="text-xl font-bold">MENÜ</h2>}
            <button 
              className="text-gray-600 md:hidden" 
              onClick={handleToggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Suchleiste */}
          {(isSidebarOpen || window.innerWidth >= 768) && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="Suche"
                className="w-full p-2 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}

          {/* Aufgaben-Bereich */}
          {(isSidebarOpen || window.innerWidth >= 768) && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">AUFGABEN</h3>
              <ul>
                <li 
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg"
                  onClick={handleItemClick}
                >
                  <div className="flex items-center justify-between w-full">
                 <div>
                 <ChevronRight className="w-5 h-5 mr-2 text-gray-600" />
                 <span>Anstehend</span>
                 </div>
                    <div>
                      <span className="ml-2 text-xs bg-blue-200 text-blue-800 rounded-full px-2 py-1">
                        {tasks.filter((task) => !task.is_completed).length}
                      </span>
                    </div>
                  </div>
                </li>
                <li 
                  className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
                  onClick={handleItemClick}
                >
                  <div className="flex items-center">
                    <List className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Heute</span>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {/* Listen-Bereich */}
          {(isSidebarOpen || window.innerWidth >= 768) && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">LISTEN</h3>
              <ul>
                <li 
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg"
                  onClick={handleItemClick}
                >
                  <div className="flex items-center">
                    <Circle className="w-4 h-4 text-red-400 mr-2" />
                    <span>Persönlich</span>
                  </div>
                </li>
                <li 
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg"
                  onClick={handleItemClick}
                >
                  <div className="flex items-center">
                    <Circle className="w-4 h-4 text-blue-200 mr-2" />
                    <span>Arbeit</span>
                  </div>
                </li>
                <li 
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-lg"
                  onClick={handleItemClick}
                >
                  <div className="flex items-center">
                    <Circle className="w-4 h-4 text-yellow-200 mr-2" />
                    <span>Liste 1</span>
                  </div>
                </li>
                <li 
                  className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
                  onClick={handleItemClick}
                >
                  <Plus className="w-5 h-5 mr-2 text-gray-600" />
                  <span>Neue Liste hinzufügen</span>
                </li>
              </ul>
            </div>
          )}

          {/* Auth-Bereich */}
          <div className="mt-auto">
            <ul>
              {isAuthenticated ? (
                <>
                  {(isSidebarOpen || window.innerWidth >= 768) && (
                    <div>
                      <li className="flex items-center justify-between p-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold mr-2">
                            {user?.username?.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{user?.username}</span>
                        </div>
                      </li>
                    </div>
                  )}
                  {(isSidebarOpen || window.innerWidth >= 768) && (
                    <li
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        handleItemClick();
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-2 text-gray-600" />
                      <span>Abmelden</span>
                    </li>
                  )}
                </>
              ) : (
                (isSidebarOpen || window.innerWidth >= 768) ? (
                  <li
                    className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => {
                      navigate('/login');
                      handleItemClick();
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-2 text-gray-600" />
                    <span
                    >Anmelden</span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;