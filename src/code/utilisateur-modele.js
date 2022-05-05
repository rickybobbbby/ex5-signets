import { authFirebase, authGoogle, bdFirestore } from './init';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Observer la connexion Firebase Auth et mettre à jour l'état 'utilisateur' à
 * chaque changement détecté (par exemple connexion/déconnexion...)
 * @param {Function} mutateurEtatUtilisateur référence à la fonction 'setter' de 
 *                                           l'état 'utilisateur'
 */
export function observerEtatConnexion(mutateurEtatUtilisateur) {
    onAuthStateChanged(authFirebase, 
        util => {
            // S'il y a un utilisateur autre que 'null', on sauvegarde dans Firestore
            if(util) {
                // La fonction sauvegarderProfil() est définie plus bas.
                sauvegarderProfil(util);
            }

            // Dans tous les cas (null ou utilisateur existant), on modifie
            // l'état pour permettre à React de mettre à jour le UI...
            mutateurEtatUtilisateur(util);
        }
    )
}

/**
 * Ouvre une connexion Firebase (avec Google)
 */
export function connexion() {
    signInWithPopup(authFirebase, authGoogle);
}

/**
 * Ferme la connexion Firebase Auth
 */
export function deconnexion() {
    authFirebase.signOut();
}

// Remarquez que la fonction suivante n'est pas exportée !!! On n'en a pas 
// besoin à l'extérieur de ce fichier.
/**
 * Sauvegarder le profil de l'utilisateur connecté dans Firestore
 * 
 * @param {Object} util Objet du profil de l'utilisateur connecté retourné par 
 * le fournisseur Google Auth
 */
function sauvegarderProfil(util) {
    // Voir la documentation : 
    // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en&authuser=0
    setDoc(
        doc(bdFirestore, 'signets', util.uid), 
        {nom: util.displayName, courriel: util.email}, 
        {merge: true}
    );
}