const Skeleton = ({
  className = '',
  lines = 4,
  card = false,
}) => {

  if (card) {

    return (
      <div
        className={`
          rounded-[28px]
          border
          border-white/10
          bg-[#081120]
          p-8
          overflow-hidden
          relative
          ${className}
        `}
      >

        {/* Shimmer */}

        <div
          className="
            absolute
            inset-0
            -translate-x-full
            animate-[shimmer_2s_infinite]
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
          "
        />

        <div className="relative z-10 space-y-5">

          <div className="h-8 w-1/3 rounded bg-white/10" />

          {Array.from({ length: lines }).map((_, i) => (

            <div
              key={i}
              className={`
                h-4
                rounded
                bg-white/10
                ${
                  i === lines - 1
                    ? 'w-2/3'
                    : 'w-full'
                }
              `}
            />

          ))}

        </div>

      </div>
    )

  }

  return (

    <div
      className={`
        relative
        overflow-hidden
        rounded-xl
        ${className}
      `}
    >

      <div
        className="
          absolute
          inset-0
          -translate-x-full
          animate-[shimmer_2s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
      />

      <div className="relative z-10 space-y-4">

        {Array.from({ length: lines }).map((_, i) => (

          <div
            key={i}
            className={`
              h-4
              rounded
              bg-white/10
              ${
                i === lines - 1
                  ? 'w-2/3'
                  : 'w-full'
              }
            `}
          />

        ))}

      </div>

    </div>

  )

}

export default Skeleton