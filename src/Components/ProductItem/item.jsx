import "./item.css";

export const ProductItem = ({ items, isFind }) => {
  return (
    <div className="items-container">
      {items.length === 0 && isFind === false && (
        <div className="loader">Loading...</div>
      )}
      {items.length > 0 && (
        <div className="product-grid">
          {items.map((item, index) => (
            <div className="product-card" key={index}>
              <div className="product-info">
                <span>
                  <b>Товар:</b> {item.product}
                </span>
                <br />
                <span>
                  <b>ID:</b> {item.id}
                </span>
                <br />
                <span>
                  <b>Бренд:</b> {item.brand ? item.brand : "N/A"}
                </span>
                <br />
                <span>
                  <b>Цена:</b> {item.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
