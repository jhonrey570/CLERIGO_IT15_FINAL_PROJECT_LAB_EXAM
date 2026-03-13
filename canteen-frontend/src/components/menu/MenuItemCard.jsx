const MenuItemCard = ({ item, onEdit, onDelete, onToggle }) => {
  const isAdmin = onEdit !== null && onEdit !== undefined;

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
      <div className="bg-gray-100 rounded-xl h-36 flex items-center justify-center mb-3 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-4xl">🍴</span>
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            item.is_available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
          }`}>
            {item.is_available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-1">{item.category?.name}</p>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
        <p className="text-lg font-bold text-blue-600">
          ₱{Number(item.price).toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 mt-1">Stock: {item.stock_qty}</p>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onEdit}
            className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100 font-medium">
            Edit
          </button>
          <button
            onClick={onToggle}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium ${
              item.is_available
                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}>
            {item.is_available ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={onDelete}
            className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg hover:bg-red-100 font-medium">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;