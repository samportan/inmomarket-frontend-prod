import { BedDouble, MapPin, Layers, Bath } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { FavoriteButton } from "@/components/ui/favoriteButton";
import { Link } from "react-router-dom";
import { ReportDialog } from "@/components/ReportDialog";
import { Card } from "@/components/ui/card";

export default function ExpandedPropertyCard(props) {
  const {
    id,
    imageUrl = "/placeholder.svg?height=200&width=300",
    title = "Modern Apartment",
    price = "$450,000",
    location = "Seattle",
    bedrooms = 3,
    bathrooms = 2,
    publisherName = "Jane Cooper",
    isNew = false,
    favorited = false,
    onFavoriteChange,
  } = props;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card className="overflow-hidden hover:shadow-sm transition-all">
      <div className="relative">
        <Link to={`/property/${id}`} className="block">
          <div className="relative aspect-[3/2]">
            {isNew && (
              <Badge className="absolute left-2 top-2 z-10" variant="secondary">
                New
              </Badge>
            )}
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              width={300}
              height={200}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Link>
        <div 
          className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full shadow-lg" 
          onClick={handleButtonClick}
        >
          <FavoriteButton
            isFavorited={favorited}
            onFavoriteChange={onFavoriteChange}
          />
        </div>
        <div className="absolute bottom-2 left-2" onClick={handleButtonClick}>
          <ReportDialog publicationId={id} />
        </div>
      </div>
      <div className="p-4 space-y-2 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <p className="font-semibold text-sm">{price}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{bathrooms}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{publisherName}</div>
        </div>
      </div>
    </Card>
  );
}
