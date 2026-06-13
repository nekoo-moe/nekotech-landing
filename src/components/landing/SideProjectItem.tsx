import React from 'react';
import styles from './SideProjectItem.module.scss';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

interface SideProjectAction {
    label: string;
    url: string;
    type: 'primary' | 'secondary' | 'github';
}

interface SideProjectItemProps {
    title: string;
    description: string;
    actions: SideProjectAction[];
}

export default function SideProjectItem({ title, description, actions }: SideProjectItemProps) {
    return (
        <div className={styles.outer}>
            <div className={styles.inner}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            
                <div className={styles.controls} style={{ marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                    {actions.map((action, index) => (
                        <a
                            key={index}
                            href={action.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btn} 
                            style={{ 
                                // Override styles if needed to differentiate
                                backgroundColor: action.type === 'primary' ? '#ffffff' : 'rgba(255,255,255,0.1)',
                                color: action.type === 'primary' ? '#000000' : '#ffffff',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '99px',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}
                        >
                            {action.type === 'github' && <Github size={16} />}
                            {action.label}
                            {action.type !== 'github' && <ExternalLink size={16} />}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
