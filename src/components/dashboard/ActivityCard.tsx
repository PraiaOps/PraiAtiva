  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="relative h-48">
      <Image
        src={activity.image || '/images/default-activity.jpg'}
        alt={activity.name}
        fill
        className="object-cover"
      />
    </div>
    
    <div className="p-6">
      <h3 className="text-xl font-semibold text-orange-600 mb-2">
        {activity.name}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {activity.description}
      </p>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="h-5 w-5 mr-2 text-orange-500" />
          <span>{activity.beach}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <ClockIcon className="h-5 w-5 mr-2 text-orange-500" />
          <span>{activity.schedule}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <UserGroupIcon className="h-5 w-5 mr-2 text-orange-500" />
          <span>Capacidade: {activity.capacity} alunos</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-orange-500" />
          <span>R$ {activity.price.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-4">
        {isEnrolled ? (
          <button
            onClick={() => onCancelEnrollment?.(activity.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancelar Matrícula
          </button>
        ) : (
          <button
            onClick={() => onEnroll?.(activity.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Matricular
          </button>
        )}
        
        <button
          onClick={() => onViewDetails?.(activity.id)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  </div> 