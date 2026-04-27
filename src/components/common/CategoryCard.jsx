import { Link } from 'react-router-dom';
import '../../styles/CategoryCard.css';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/category/${category.slug}`} className="category-card-link">
      <div className="category-card">
        <div className="category-image-wrapper">
          <img src={category.image} alt={category.name} className="category-img" />
        </div>
        <span className="category-name">{category.name}</span>
      </div>
    </Link>
  );
};

export default CategoryCard;
