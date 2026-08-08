import './CountriesMarquee.css';

const countries = [
  { name: 'Togo', code: 'tg' },
  { name: 'Gabon', code: 'ga' },
  { name: 'Kenya', code: 'ke' },
  { name: 'Ghana', code: 'gh' },
  { name: 'Guinée', code: 'gn' },
  { name: 'Tchad', code: 'td' },
  { name: 'Niger', code: 'ne' },
  { name: 'Bénin', code: 'bj' },
  { name: "Côte d'Ivoire", code: 'ci' },
  { name: 'Sénégal', code: 'sn' },
];

function CountriesMarquee() {
  const loopCountries = [...countries, ...countries];

  return (
    <section className="countries-section">
      <p className="countries-label">Utilisé par des commerçants dans...</p>

      <div className="countries-marquee">
        <div className="countries-track">
          {loopCountries.map((country, index) => (
            <span className="countries-item" key={index}>
              <img
                src={`https://flagcdn.com/w40/${country.code}.png`}
                alt={country.name}
                className="countries-flag-img"
              />
              {country.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CountriesMarquee;