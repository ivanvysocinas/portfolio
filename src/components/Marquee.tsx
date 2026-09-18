import type { IconType } from 'react-icons';
import { TbBox } from 'react-icons/tb';
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiReactrouter,
  SiRedux,
  SiExpress,
  SiNodedotjs,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiJsonwebtokens,
  SiDocker,
  SiGit,
  SiVite,
} from 'react-icons/si';

const techs: { name: string; icon: IconType; color: string }[] = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#EDEDED' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'React Router', icon: SiReactrouter, color: '#CA4245' },
  { name: 'Zustand', icon: TbBox, color: '#E8860C' },
  { name: 'Redux', icon: SiRedux, color: '#764ABC' },
  { name: 'Express', icon: SiExpress, color: '#EDEDED' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'JWT', icon: SiJsonwebtokens, color: '#FB015B' },
  { name: 'Vite', icon: SiVite, color: '#646CFF' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
];

function Strip({ reverse }: { reverse?: boolean }) {
  return (
    <div className={`marquee-strip ${reverse ? 'marquee-reverse' : ''}`}>
      {[...techs, ...techs].map((t, i) => (
        <span className="marquee-item" key={i}>
          <t.icon className="marquee-icon" style={{ color: t.color }} aria-hidden="true" />
          {t.name}
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        <Strip />
      </div>
      <div className="marquee-track">
        <Strip reverse />
      </div>
    </div>
  );
}
